import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeviewnodeComponent } from './treeviewnode.component';

describe('TreeviewnodeComponent', () => {
  let component: TreeviewnodeComponent;
  let fixture: ComponentFixture<TreeviewnodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeviewnodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeviewnodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
