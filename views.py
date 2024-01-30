from django.shortcuts import render

# todo_app/views.py
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

# myapp/views.py
def index(request):
    return render(request, 'static/index.html')

def tasks(request):
    return render(request, 'static/tasks.html')

