from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'joining_date', 'created_at']
        read_only_fields = ['id', 'employee_id', 'joining_date', 'created_at']
