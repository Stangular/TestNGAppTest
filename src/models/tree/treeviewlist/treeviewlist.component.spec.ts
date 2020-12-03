import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeviewlistComponent } from './treeviewlist.component';

describe('TreeviewlistComponent', () => {
  let component: TreeviewlistComponent;
  let fixture: ComponentFixture<TreeviewlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeviewlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeviewlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
