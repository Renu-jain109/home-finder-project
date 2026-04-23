import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../services/property.service';
import { INDIAN_STATES } from '../../models/property.model';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class AddPropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  isEditMode = false;
  propertyId = '';
  loading = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  indianStates = INDIAN_STATES;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();

    // Check if edit mode
    this.propertyId = this.route.snapshot.paramMap.get('id') || '';
    if (this.propertyId) {
      this.isEditMode = true;
      this.loadPropertyData();
    }
  }

  initForm() {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      state: ['', Validators.required],
      bedrooms: ['', [Validators.required, Validators.min(0)]],
      bathrooms: [1, [Validators.required, Validators.min(0)]],
      area: ['', [Validators.required, Validators.min(1)]],
      type: ['Rent', Validators.required],
      propertyCategory: ['Apartment', Validators.required],
      imageUrl: [''],
      description: [''],
      contactName: ['', Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  loadPropertyData() {
    this.loading = true;
    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (res: any) => {
        this.propertyForm.patchValue(res.data);        
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load property data.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const formData = this.propertyForm.value;

    if (this.isEditMode) {
      this.propertyService.updateProperty(this.propertyId, formData).subscribe({
        next: () => {
          this.successMessage = 'Property updated successfully!';
          this.submitting = false;
          setTimeout(() => this.router.navigate(['/listings']), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update property.';
          this.submitting = false;
        }
      });
    } else {
      this.propertyService.createProperty(formData).subscribe({
        next: () => {
          this.successMessage = 'Property listed successfully!';
          this.submitting = false;
          setTimeout(() => this.router.navigate(['/listings']), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to create property.';
          this.submitting = false;
        }
      });
    }
  }

  // Shorthand for template validation
  f(field: string) {
    return this.propertyForm.get(field);
  }
}
