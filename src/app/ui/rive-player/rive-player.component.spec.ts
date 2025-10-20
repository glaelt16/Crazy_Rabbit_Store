import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RivePlayerComponent } from './rive-player.component';

describe('RivePlayerComponent', () => {
  let component: RivePlayerComponent;
  let fixture: ComponentFixture<RivePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RivePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RivePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
