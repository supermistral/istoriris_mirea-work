months = {
    'September': 'Сентября',
    'October': 'Октября',
    'November': 'Hоября',
    'December': 'Декабря',
    'January': 'Января',
    'February': 'Февраля',
    'March': 'Марта',
    'April': 'Апреля',
    'May': 'Мая',
    'June': 'Июня',
    'July': 'Июля',
    'August': 'Августа'
}

def translate_month_lang(month: str) -> str:
    return months[month] if month in months else month