from django.conf.urls import url
from django.urls import path

from . import views

urlpatterns = [
url(r'^$', views.index, name='index'),
path('^<str:message>/$', views.index, name='index'),
url(r'register/$', views.register, name='register'),
url(r'login/$' ,views.login, name="login"),
url(r'logout/$' ,views.logout, name="logout"),
url(r'home/$' ,views.home , name="home"),
url(r'ask/$', views.ask_ques, name="ask_ques"),
url(r'load_search/$', views.load_search ,name="load_search"),
url(r'top_feed/$' , views.top_feed , name="top_feed"),
url(r'my_ques/$' ,views.my_ques , name="my_ques"),
url(r'my_ans/$' , views.my_ans , name="my_ans"),
url(r'view_ans/$', views.view_ans , name="view_ans"),
url(r'press_like/$', views.press_like , name="press_like"),
url(r'post_ques/$' , views.post_ques , name="post_ques"),
url(r'post_ans/$' , views.post_ans , name="post_ans"),
url(r'write_ans/$' , views.write_ans , name="write_ans"),
url(r'show_edit/$' , views.show_edit , name="sow_edit"),
url(r'post_edit/$' , views.post_edit, name="pst_edit"),
]


