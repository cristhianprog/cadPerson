import {Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['id', 'name', 'age', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService, 
              public dialog: MatDialog, 
              public loader: LoadingBarService,
              public snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loader.start();
    this.loadTable();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

  }

  loadTable() {
    this.api.get('people').subscribe(response => {

			let arrayPeople = response.sort((a: any, b: any) => { //coloca em ordem alfabética
				if (a.id > b.id) {
					return 1;
				}
				else if (a.id < b.id) {
					return -1;
				}
			})

      this.dataSource = new MatTableDataSource(arrayPeople);
      this.dataSource.sort = this.sort;

      this.loader.complete();

    });
    this.cdr.detectChanges()
  }

  delete(data: any){
    //abre modal
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '600px',
			data: {
				title: 'Excluir',
				question: 'Do you really want to delete this record?',
				other: 'name: ' + data.name
			}
		});

		dialogRef.afterClosed().subscribe(result => {
      this.loader.start();

			if (result) {
        this.snackBar.open('Deleting...', 'Ok');

        const saveSubscription: any = this.api.delete('person', data.id)
        .subscribe((data) => {
        console.log('data :', data);
          this.snackBar.open(data.message, 'Ok', {duration: 3000});
          this.loader.complete();
          setTimeout(() => {
            this.loadTable();
          }, 1000);
          
  
        }, err => {
          this.snackBar.open(err.message, 'Ok', {duration: 3000});
          this.loader.complete();

        });
        this.subscriptions.push(saveSubscription);

			}
		});

  }
}