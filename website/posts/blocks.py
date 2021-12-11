from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock as DefaultImageChooserBlock


class ImageChooserBlock(DefaultImageChooserBlock):

    def get_api_representation(self, value, context=None):
        if value:
            return {
                'title': value.title,
                'image': value.get_rendition('original').attrs_dict
            }
        return super().get_api_representation(value, context=context)


class PostBlock(blocks.StreamBlock):
    image = ImageChooserBlock()
    text = blocks.RichTextBlock()

    class Meta:
        label = "Post block"
        icon = 'edit'