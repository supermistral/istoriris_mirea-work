from django.contrib import admin
from .models import *


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    pass


class BookInstanceExtraInline(admin.TabularInline):
    model = BookInstanceExtra


@admin.register(BookInstance)
class BookInstanceAdmin(admin.ModelAdmin):
    inlines = [BookInstanceExtraInline]


@admin.register(BookInstanceExtra)
class BookInstanceExtraAdmin(admin.ModelAdmin):
    pass


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    pass


class SectionPageInline(admin.TabularInline):
    model = SectionPage


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    inlines = [SectionPageInline]


@admin.register(SectionPage)
class SectionPageAdmin(admin.ModelAdmin):
    pass