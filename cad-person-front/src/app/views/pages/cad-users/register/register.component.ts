import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  
  dataForm: FormGroup;
  loading: boolean = false;
  title: string = '';
  idUrl: string;
 
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public loader: LoadingBarService,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loader.start();

    this.idUrl = this.activatedRoute.snapshot.params["id"]; //pega id da url
    console.log('this.idUrl :', this.idUrl);

    //criação de formulário reativo  
    this.dataForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      age: [null, Validators.required],
    });

  
    if(!this.idUrl){
     this.title = 'Register';
     this.loader.complete();

    }else{
      this.title = 'Edit';

      const saveSubscription: any = this.api.get('person/' + this.idUrl)
      .subscribe((data) => {
      console.log('data :', data);
        //seta os valores em cada campo
        this.dataForm.get('id')?.setValue(data.id)
        this.dataForm.get('name')?.setValue(data.name)
        this.dataForm.get('age')?.setValue(data.age)

        this.loader.complete();

      }, err => {
      console.log('err :', err);
        this.snackBar.open(err.message, 'Ok', {duration: 3000});
        this.loader.complete();

      });
      this.subscriptions.push(saveSubscription);

    }
   
  }

  submit() {
    this.loading = true;
    this.loader.start();
    console.log('this.dataForm :', this.dataForm);

    //verifica a validaçao dos campos
    if (!this.dataForm.invalid) {

      //verifica se possui id 
      if(this.dataForm.get('id')?.value){
        this.edit();
      }else {
        this.create();
      }

    }else{
      //percorre os campos
      Object.keys(this.dataForm.controls).forEach(field => {
				const control: any = this.dataForm.get(field);
				control.markAsTouched(); //ativa o campo 
			});
      this.snackBar.open('Fill in the fields correctly!', 'Ok', {duration: 3000});
      this.loading = false;
      this.loader.complete();

      return;
    }
  }

  edit(){
     let dataSend = this.dataForm.value;

			const saveSubscription: any = this.api.put('person', dataSend)
      .subscribe((data) => {
      console.log('data :', data);

        this.snackBar.open('Edited successfully', 'Ok', {duration: 3000});
        this.loading = false;
        this.loader.complete();
        this.router.navigate(['/']);

      }, err => {
        console.log("Error edit",err );
        this.snackBar.open(err.message, 'Ok', {duration: 3000});
        this.loading = true;
      });
      this.subscriptions.push(saveSubscription);

  }

  create(){
      let dataSend = this.dataForm.value;

			const saveSubscription: any = this.api.post('person', dataSend)
      .subscribe((data) => {
        this.snackBar.open('Created successfully', 'Ok', {duration: 3000});
        this.loading = false;
        this.loader.complete();
        this.router.navigate(['/']); 

      }, err => {
        console.log("Error save", err);
        this.snackBar.open(err.message, 'Ok', {duration: 3000});
        this.loading = true;
      });
      this.subscriptions.push(saveSubscription);
  }

}