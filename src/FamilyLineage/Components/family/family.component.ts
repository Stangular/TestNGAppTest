import { Component, OnInit,Input} from '@angular/core';
import { A_Term, A_Sequence } from 'src/dataManagement/model/sequencing/sequence';
import { FormControl } from '@angular/forms';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';

@Component({
  selector: 'family_manager',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {

  surnames: A_Sequence<number,string,number>;
  members: A_Sequence<number,string,  number>;
 // surnameControl = new FormControl();
 // personControl = new FormControl();
  constructor(private edfs: ElementDefinitionFactoryService) {
    this.surnames = new A_Sequence("surname", 0,0,0,"Surname");
    this.members = new A_Sequence("familyMembers", 1,1,1,"Family");
  }

  ngOnInit() {
    this.surnames.AddItem(0, "Shannon");
    this.surnames.AddItem(1, "Martin");
    this.surnames.AddItem(2, "Rowell");
    this.surnames.SortByContent();
    this.surnames
    this.members.AddItem(0, "John");
    this.members.AddItem(1, "William");
    this.members.AddItem(2, "Owen");
    this.members.SortByOrder();
  }

  AddSurname(surname: string) {
    this.ClearSelection('');
    this.surnames.AddNewContent(-1,surname);
   // this.surnameControl.setValue(surname);
    //service
  }

  RemoveSurname(surnameId: string) {
    alert(surnameId);
  }
  SearchSurname(surnameId: string) {
    alert(surnameId);
  }
  ClearSelection(surnameId: string) {
 //   this.surnameControl.setValue('');
  //  this.personControl.setValue('');
  }

}
