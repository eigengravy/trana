from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet
from .views import ChatViewSet
from .views import ScrapperViewSet

router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')
router.register('chat', ChatViewSet, basename='chat')
router.register('scrape', ScrapperViewSet, basename='scrape')



urlpatterns = [
    path('api/', include(router.urls)),
]