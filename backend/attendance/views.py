from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by('-date')
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        employee_id = self.request.query_params.get('employee_id')
        date = self.request.query_params.get('date')

        if employee_id:
            queryset = queryset.filter(employee__employee_id=employee_id)
        if date:
            queryset = queryset.filter(date=date)
        
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Check if it's a unique constraint error
            if 'non_field_errors' in serializer.errors:
                 # The unique_together validtion usually ends up here or in field errors
                 pass
            # Construct a clear error
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
