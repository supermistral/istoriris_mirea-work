from django.shortcuts import render, get_object_or_404
from .models import *
from .serializers import *
from rest_framework import generics


class BookInstanceListView(generics.ListAPIView):
    serializer_class = BookInstanceSerializer
    queryset = BookInstance.ready_objects.all()


class BookInstanceDetailView(generics.RetrieveAPIView):
    serializer_class = BookInstanceDetailSerializer
    queryset = BookInstance.ready_objects.all()
        

class SectionListView(generics.ListAPIView):
    serializer_class = SectionSerializer
    lookup_url_kwarg = 'bookinstance_id'

    def get_queryset(self):
        bookinstance_id = self.kwargs.get(self.lookup_url_kwarg)
        bookinstance = get_object_or_404(BookInstance.ready_objects.all(), pk=bookinstance_id)
        return Section.ready_objects.filter(bookinstance=bookinstance)


class SectionDetailView(generics.RetrieveAPIView):
    serializer_class = SectionDetailSerializer
    queryset = Section.ready_objects.all()
    lookup_url_kwarg = 'section_id'