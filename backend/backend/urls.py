from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse
import os


def serve_index(request):
    index_path = os.path.join(settings.BASE_DIR, 'static', 'index.html')
    return FileResponse(open(index_path, 'rb'), content_type='text/html')


def serve_static_file(request, filepath):
    file_path = os.path.join(settings.BASE_DIR, 'static', filepath)
    if not os.path.exists(file_path):
        from django.http import Http404
        raise Http404()
    # Infer content type simple
    if filepath.endswith('.js'):
        content_type = 'application/javascript'
    elif filepath.endswith('.css'):
        content_type = 'text/css'
    else:
        content_type = 'application/octet-stream'
    return FileResponse(open(file_path, 'rb'), content_type=content_type)


urlpatterns = [
    path('', serve_index, name='index'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('static/<path:filepath>', serve_static_file),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'static'))
