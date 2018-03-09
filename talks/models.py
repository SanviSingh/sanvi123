from django.db import models

# Create your models here.

class Guest(models.Model):
    userid=models.AutoField(primary_key=True)
    name=models.CharField(max_length=200)
    email=models.CharField(max_length=500,unique=True)
    password=models.CharField(max_length=20)

    def register():
       self.save()


    def __str__(self):
        return self.name


class Genre(models.Model):
    genreid = models.AutoField(primary_key=True)
    gname   = models.CharField(max_length=200)

    def __str__(self):
        return self.gname

class Notification(models.Model):
    eventid  = models.AutoField(primary_key=True)
    event    = models.TextField()
    user     = models.ForeignKey(Guest, blank=True, null=True, on_delete=models.SET_NULL)
    timestamp= models.DateTimeField(auto_now=True)

class Question(models.Model):
    qid      = models.AutoField(primary_key=True)
    user     = models.ForeignKey(Guest, blank=True, null=True, on_delete=models.SET_NULL)
    qtext    = models.TextField()
    qdesc    = models.TextField()
    genre    = models.ForeignKey(Genre, blank=True, null=True, on_delete=models.SET_NULL)
    hcount   = models.IntegerField()
    timestamp= models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return (self.qtext)

class Answer(models.Model):
    aid     = models.AutoField(primary_key=True)
    question= models.ForeignKey(Question, blank=True, null=True, on_delete=models.SET_NULL)
    user    = models.ForeignKey(Guest, blank=True, null=True, on_delete=models.SET_NULL)
    atext   = models.TextField()
    likes   = models.IntegerField()
    timestamp= models.DateTimeField(auto_now_add=True,null=True) 
    
    def __str__(self):
        return self.atext

class Votes(models.Model):
    answer = models.ForeignKey(Answer , blank=True, null=True, on_delete=models.SET_NULL)
    user   = models.ForeignKey(Guest , blank=True, null=True, on_delete=models.SET_NULL)

