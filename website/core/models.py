from django.db import models
from django.utils import timezone
from django.core.files.images import ImageFile
from django.core.files.base import ContentFile
from .custom_fields import CompressedImageField, CompressedImageFieldFile


class ReadyManager(models.Manager):
    def get_queryset(self):
        queryset = super().get_queryset()
        if queryset.exists():
            return queryset.filter(date_publication__lte=timezone.now(), is_active=True)\
                .order_by('-date_publication')
        return queryset


class Book(models.Model):
    name = models.CharField(max_length=70)
    date_publication = models.DateField(default=timezone.now)
    banner_image = models.ImageField(upload_to="banners", blank=True, null=True)

    def __str__(self):
        return self.name


class BookInstance(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='bookinstances', blank=True, null=True)
    name = models.CharField(max_length=70)
    date_publication = models.DateField(default=timezone.now)
    status_choices = (('Завершена', 'finished'),
                      ( 'Продолжается', 'writing'))
    status = models.CharField(max_length=20, choices=status_choices)
    genre = models.ManyToManyField(to='Genre', related_name='genres')
    description = models.TextField(blank=True, null=True)
    number_of_pages = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)

    objects = models.Manager()
    ready_objects = ReadyManager()

    def __str__(self):
        return self.book.name + " -> " + self.name

    @property
    def fullname(self):
        return self.book.name + ": " + self.name


class BookInstanceExtra(models.Model):
    bookinstance = models.OneToOneField(
        BookInstance,
        on_delete=models.CASCADE,
        related_name='bookinstance_extra'
    )
    image = models.ImageField(upload_to="bookinstances/covers/")
    image_preview_1 = models.ImageField(upload_to="bookinstances/previews/", blank=True, null=True)
    image_preview_2 = models.ImageField(upload_to="bookinstances/previews/", blank=True, null=True)

    def __str__(self):
        return self.bookinstance.__str__()


class Section(models.Model):
    bookinstance = models.ForeignKey(
        BookInstance, 
        on_delete=models.CASCADE, 
        related_name='sections'
    )
    name = models.CharField(max_length=50)
    number = models.PositiveIntegerField(default=0)
    date_publication = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=False)

    objects = models.Manager()
    ready_objects = ReadyManager()

    class Meta:
        ordering = ['-number']

    def __str__(self):
        return f"{self.bookinstance} -> {self.name}"

    def save(self, *args, **kwargs):
        if self.number == 0:
            sections = Section.objects.all()
            if sections.exists():
                self.number = self.number = sections.count() + 1

        return super().save(*args, **kwargs)

    
class SectionPage(models.Model):
    section = models.ForeignKey(
        Section, 
        on_delete=models.CASCADE,
        related_name='sectionpages'
    )
    image = models.ImageField(upload_to='sections/pages/original/', null=True)
    image_low = CompressedImageField(
        upload_to='sections/pages/low/', 
        blank=True, 
        null=True,
        quality=70
    )
    number = models.PositiveIntegerField(blank=True)

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f"{self.section} -> {self.number}"

    def save(self, *args, **kwargs):
        if self.number is None:
            pages = SectionPage.objects.filter(section__id=self.section.id)
            self.number = 1 + pages.count()

        if not self.image_low:
            self.image_low.save(
                self.image.name.split('/')[-1] + "_low", 
                ContentFile(self.image.read())
            )
       
        bookinstance = self.section.bookinstance
        bookinstance.number_of_pages = SectionPage.objects.filter(section__bookinstance__id=bookinstance.id).count()
        bookinstance.save()

        return super().save(*args, **kwargs)


class Genre(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name