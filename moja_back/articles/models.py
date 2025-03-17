from django.db import models

class News(models.Model):
    title = models.CharField(max_length=255)  # 기사 제목
    content = models.TextField()  # 기사 내용
    url = models.URLField()  # 기사 URL
    publish_date = models.DateTimeField(null=True, blank=True) # 발행일

    def __str__(self):
        return self.title
