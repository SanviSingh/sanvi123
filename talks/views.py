from django.shortcuts import render,redirect
from django.urls import reverse
# Create your views here.
from django.template import loader
from django.http import HttpResponse , HttpResponseRedirect
from talks.models import *
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
import json

def index(request,message=None):
    uid = request.session.get('user_id')
    if uid:
         return redirect(home)
    users = []
    for e in Guest.objects.all():
             users.append(e.email)
    if not message:
        return render(request,"login.html",{'emails':users})
    else:
        return render(request,"login.html",{'emails':users,'msg':message})
        

def register(request):
    if request.method == 'POST':
         username = request.POST.get('name')
         emailid  = request.POST.get('email')
         passwd = request.POST.get('passwd')

         user = Guest.objects.create(name=username,email=emailid,password=passwd)
         user.save()

         users = []
         for e in Guest.objects.all():
             users.append(e.email)
         return HttpResponse(json.dumps({'msg': 'success','users':users}),content_type="application/json")
    else:
        return HttpResponse(json.dumps({'msg': 'not registered'}),content_type="application/json")

def login(request):
    try:
        m = Guest.objects.get(email=request.POST.get('login_email'))
        if m.password == request.POST.get('login_passwd'):
             request.session['user_id'] = m.userid
             return redirect(home)
        else:
             return redirect(index,message="login failed")
    except ObjectDoesNotExist:
             return redirect(index,message="login failed")

def logout(request):
    try:
        del request.session['user_id']
    except KeyError:
        pass
    return redirect(index)

#@login_required
def home(request):
    try:
        person = Guest.objects.get(userid=request.session.get('user_id'))
        # how many questions answered
        answers = Answer.objects.filter(user=person).count()
        # How many questions asked
        questions = Question.objects.filter(user=person).count()
        # How many likes
        like_obj = Answer.objects.filter(user=person)
        likes = sum([ obj.likes for obj in like_obj])

        n=Notification.objects.filter(user=person).order_by('-timestamp')[:10]
        return render(request,"dashboard.html",{'name':person.name ,'question':questions,'answer':answers,'likes':likes , 'notifications':n})
    except ObjectDoesNotExist: 
        return redirect(index)

def ask_ques(request):
      posts_html = loader.render_to_string("question_form.html",{'csrf_token':request.POST.get('csrf')});
      output_data = {
         'posts_html':posts_html,
      }
      return JsonResponse(output_data)

def load_search(request):
      posts_html = loader.render_to_string("search.html",{'dummy':'dummy'});
      output_data = {
         'posts_html':posts_html,
      }
      return JsonResponse(output_data)


def top_feed(request):
    top_feeds  = Question.objects.all().order_by('-hcount','-timestamp')
    posts_html = loader.render_to_string("feeds.html",{'feeds':top_feeds})
    output_data = {
         'posts_html':posts_html,
      }
    return JsonResponse(output_data)

def my_ques(request):
    try:
        person = Guest.objects.get(userid=request.session.get('user_id'))
        # How many questions asked
        questions = Question.objects.filter(user=person)
        posts_html = loader.render_to_string("myquestion.html",{'name':person.name ,'questions':questions})
        output_data = {
         'posts_html':posts_html,
        }
        return JsonResponse(output_data)
    except ObjectDoesNotExist:
        return redirect(index)

def my_ans(request):
    try:
        person = Guest.objects.get(userid=request.session.get('user_id'))
        # How many questions answered
        answers = Answer.objects.filter(user=person)
        posts_html = loader.render_to_string("myanswer.html",{'name':person.name ,'answers':answers})
        output_data = {
         'posts_html':posts_html,
        }
        return JsonResponse(output_data)
    except ObjectDoesNotExist:
        return redirect(index)

def view_ans(request):
    try:
        queid = request.POST.get('qid')
        ques = Question.objects.get(qid=queid)
        answers = Answer.objects.filter(question=ques).order_by("-timestamp")
        back = None
        if ( "backmyques" == request.POST.get('back')):
             back = "showMyQuestion()"
        print(back,"hello")
        person = Guest.objects.get(userid=request.session.get('user_id'))
        liked=dict()
        for a in answers:
             liked[a.aid]=Votes.objects.filter(user=person,answer=a).count()
        posts_html = loader.render_to_string("viewanswer.html",{ 'answers' : answers , 'ques':ques , 'liked':liked , 'session_userid':request.session.get('user_id') , 'back':back})
        output_data = {
         'posts_html':posts_html,
        }
        return JsonResponse(output_data)
    except ObjectDoesNotExist:
        return redirect(index)

def press_like(request):
    try:
        aid = request.POST.get('aid')
        ans = Answer.objects.get(aid=aid)
        person = Guest.objects.get(userid=request.session.get('user_id'))

        #create an entry in Vote table
        # send notification to author
        # update total likes in answer table

        v = Votes.objects.create(user=person,answer=ans)
        v.save()

        n = Notification.objects.create(event="you have got one vote from "+person.name,user=ans.user)
        n.save()

        count = Answer.objects.get(aid=aid)
        count.likes = count.likes + 1
        count.save()

        output_data = { 'likes':count.likes }
        return JsonResponse(output_data)

    except ObjectDoesNotExist:
        return redirect(index)
      

def post_ques(request):
    try:
        text= request.POST.get("qtext")
        desc= request.POST.get("qdesc")
        gen  = request.POST.get("genre")
        count=0
        genr = Genre.objects.get(gname=gen)
        person = Guest.objects.get(userid=request.session.get('user_id'))
        ques = Question.objects.create(qtext=text,qdesc=desc,genre=genr,hcount=count,user=person)
        ques.save()

        #posts_html = loader.render_to_string("success_ques.html",{'dummy':'dummy'}); 
        #output_data = { 'posts_html':posts_html }
        #return JsonResponse(output_data)
        return HttpResponse("success")
    except ObjectDoesNotExist:
        return redirect(index)

def post_ans(request):
    try:
        qid= request.POST.get("qid")
        adesc = request.POST.get("atext")
        ques = Question.objects.get(qid=qid)
        person = Guest.objects.get(userid=request.session.get('user_id'))
        ans = Answer.objects.create(atext=adesc,question=ques,user=person,likes=0)
        ans.save()
        answers = Answer.objects.filter(question=ques).order_by("-timestamp")
        liked=dict()
        for a in answers:
             liked[a.aid]=Votes.objects.filter(user=person,answer=a).count()
        posts_html = loader.render_to_string("viewanswer.html",{ 'answers' : answers , 'ques':ques , 'liked':liked , 'session_userid':request.session.get('user_id')})
        output_data = {
         'posts_html':posts_html,
        }
        return JsonResponse(output_data)
    except ObjectDoesNotExist:
        return redirect(index)         

def write_ans(request):
    try:
        qid= request.POST.get("qid")
        ques = Question.objects.get(qid=qid)
        posts_html = loader.render_to_string("write_answer.html",{'csrf_token':request.POST.get('csrf'),'question':ques});
        output_data = {
         'posts_html':posts_html,
        }
        return JsonResponse(output_data)
    except ObjectDoesNotExist:
        return redirect(index)

def show_edit(request):
    try:
        qid= request.POST.get("qid")
        aid= request.POST.get("aid")
        ques = Question.objects.get(qid=qid)
        ans  = Answer.objects.get(aid=aid)
        posts_html = loader.render_to_string("edit_answer.html",{'csrf_token':request.POST.get('csrf'),'question':ques, 'answer':ans});
        output_data = {
         'posts_html':posts_html,
        }
        return JsonResponse(output_data)
    except ObjectDoesNotExist:
        return redirect(index)

def post_edit(request):
    try:
        qid= request.POST.get("qid")
        aid= request.POST.get("aid")
        ques = Question.objects.get(qid=qid)
        person = Guest.objects.get(userid=request.session.get('user_id'))
        ans  = Answer.objects.get(aid=aid)
        ans.atext = request.POST.get("atext")
        ans.save()
        answers = Answer.objects.filter(question=ques).order_by("-timestamp")
        back    = "showMyAnswer()"
        liked=dict()
        for a in answers:
             liked[a.aid]=Votes.objects.filter(user=person,answer=a).count()
        posts_html = loader.render_to_string("viewanswer.html",{ 'answers' : answers , 'ques':ques , 'liked':liked , 'session_userid':request.session.get('user_id'),"back":back})
        output_data = {
         'posts_html':posts_html,
        }
        return JsonResponse(output_data)
    except ObjectDoesNotExist:
        return redirect(index)


