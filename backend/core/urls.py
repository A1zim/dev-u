from django.urls import path
from .views import DirectionListCreateView

urlpatterns = [
    path('directions/', DirectionListCreateView.as_view(), name='direction-list-create'),
]