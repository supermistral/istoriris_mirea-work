from rest_framework import serializers
from .models import *
from .utils import translate_month_lang


class BookInstanceExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookInstanceExtra
        fields = ['image', 'image_preview_1', 'image_preview_2']


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = "__all__"


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('id', 'name', 'date_publication')


class BookInstanceSerializer(serializers.ModelSerializer):
    extra = BookInstanceExtraSerializer(read_only=True, source="bookinstance_extra")
    genre = GenreSerializer(read_only=True, many=True)
    
    class Meta:
        model = BookInstance
        fields = ('id', 'name', 'date_publication', 'status', 
                  'genre', 'description', 'extra')


class BookInstanceForInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookInstance
        fields = ['id', 'name']
    

class BookInstanceDetailExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookInstanceExtra
        fields = ['image']


class DateFieldRU(serializers.DateField):
    """Обертка поверх DateField для перевода месяца на русский"""

    def to_representation(self, instance):
        date = super().to_representation(instance)
        values = date.split(" ")
        values[1] = translate_month_lang(values[1])
        return " ".join(values)


class BookInstanceDetailSerializer(serializers.ModelSerializer):
    extra = BookInstanceDetailExtraSerializer(read_only=True, source="bookinstance_extra")
    genre = GenreSerializer(read_only=True, many=True)
    sections = serializers.SerializerMethodField()
    book_name = serializers.ReadOnlyField(source='book.name')
    banner_image = serializers.ImageField(read_only=True, source='book.banner_image')
    book_before = serializers.SerializerMethodField()
    book_after = serializers.SerializerMethodField()
    date_publication = DateFieldRU(format='%d %B %Y')

    class Meta:
        model = BookInstance
        fields = ('name', 'date_publication', 'status', 'genre',
                  'description', 'number_of_pages', 'extra', 'sections', 
                  'banner_image', 'book_name', 'book_before', 'book_after')

    def get_sections(self, obj):
        sections = Section.ready_objects.filter(bookinstance__id=obj.id)
        return SectionSerializer(sections, read_only=True, many=True).data

    def get_book_before(self, obj):
        book = BookInstance.ready_objects.filter(book__id=obj.book.id, date_publication__gt=obj.date_publication)
        if book.exists():
            book = book.order_by('date_publication').first()
        else:
            book = None
        return BookInstanceForInstanceSerializer(book, read_only=True).data

    def get_book_after(self, obj):
        book = BookInstance.ready_objects.filter(book__id=obj.book.id, date_publication__lt=obj.date_publication)
        if book.exists():
            book = book.order_by('date_publication').first()
        else:
            book = None
        return BookInstanceForInstanceSerializer(book, read_only=True).data


class SectionPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionPage
        fields = ['image', 'image_low', 'number']


class BookInstanceInSectionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookInstance
        fields = ['id', 'fullname']


class SectionShortDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'name', 'number']


class SectionLinksField(serializers.Field):

    @staticmethod
    def get_section_value(section_qs):
        if section_qs is None:
            return None
        section = section_qs.first()
        return {'id' : section.id, 'name': section.name, 'number': section.number}

    def to_representation(self, instance):
        sections = list(Section.ready_objects.values_list('id', flat=True))
        obj_index = sections.index(instance.id)
        section_next = Section.ready_objects.filter(id=sections[obj_index + 1]) \
            if obj_index < len(sections) - 1 else None
        section_prev = Section.ready_objects.filter(id=sections[obj_index - 1]) \
            if obj_index > 0 else None

        return {
            'prev': self.get_section_value(section_prev),
            'next': self.get_section_value(section_next)
        }


class SectionDetailSerializer(serializers.ModelSerializer):
    pages = SectionPageSerializer(read_only=True, many=True, source="sectionpages")
    total_pages = serializers.SerializerMethodField()
    book = BookInstanceInSectionDetailSerializer(read_only=True, source="bookinstance")
    links = SectionLinksField(source='*', read_only=True)
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ('name', 'number', 'book', 'total_pages', 
                  'pages', 'links', 'sections')

    def get_total_pages(self, obj):
        return obj.sectionpages.all().count()

    def get_sections(self, obj):
        book_id = obj.bookinstance.id
        sections = Section.ready_objects.filter(bookinstance__id=book_id)
        return SectionShortDetailSerializer(sections, read_only=True, many=True).data