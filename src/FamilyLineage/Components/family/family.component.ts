import { Component, OnInit } from '@angular/core';
import { ListItem, List} from 'src/dataManagement/model/list/list';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'family_manager',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {

  surnames: List;
  members: List;
  surnameControl = new FormControl();
  personControl = new FormControl();
  constructor() {
    this.surnames = new List("surname", "0");
    this.members = new List("familyMembers", "1");
  }

  ngOnInit() {
    this.surnames.AddItem("111", "Shannon", 0);
    this.surnames.AddItem("222", "Martin", 1);
    this.surnames.AddItem("333", "Rowell", 2);
    this.surnames.SortByContent();
    this.surnames
    this.members.AddItem("111", "John",0);
    this.members.AddItem("222", "William", 1);
    this.members.AddItem("333", "Owen", 2);
    this.members.SortByOrder();
  }

  AddSurname(surname: string) {
    this.ClearSelection('');
    this.surnames.AddNewContent(surname);
    this.surnameControl.setValue(surname);
    //service
  }

  RemoveSurname(surnameId: string) {
    alert(surnameId);
  }
  SearchSurname(surnameId: string) {
    alert(surnameId);
  }
  ClearSelection(surnameId: string) {
    this.surnameControl.setValue('');
    this.personControl.setValue('');
  }

}
