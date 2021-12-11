from django.urls import path
from .views import *


urlpatterns = [
    path('books/', BookInstanceListView.as_view(), name="book"),
    path('books/<int:pk>/', BookInstanceDetailView.as_view()),
    path('books/<int:bookinstance_id>/sections/', SectionListView.as_view()),
    path('sections/<int:section_id>/', SectionDetailView.as_view()),
]