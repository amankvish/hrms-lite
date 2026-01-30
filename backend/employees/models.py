from django.db import models
from datetime import date

class Employee(models.Model):
    employee_id = models.CharField(max_length=20, unique=True, blank=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50)
    joining_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.employee_id:
            last_record = Employee.objects.order_by('-id').first()
            if last_record and last_record.employee_id.startswith('EMP'):
                try:
                    last_number = int(last_record.employee_id.replace('EMP', ''))
                    new_number = last_number + 1
                except ValueError:
                    new_number = 1
            else:
                new_number = 1
            self.employee_id = f'EMP{new_number:03d}'
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.employee_id})"
