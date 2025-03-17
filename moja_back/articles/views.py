from newspaper import Source
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import NewsSerializer
from .models import News
from datetime import datetime

@api_view(['GET'])
def fetch_and_save_news(request):
    """
    크롤링된 뉴스 데이터를 가져와 DB에 저장
    """
    # 기존 데이터를 삭제
    News.objects.all().delete()

    # Source URL 지정
    # source = Source('https://www.chosun.com/economy/')
    source = Source('https://www.sedaily.com/')
    source.build()

    # 크롤링된 데이터를 저장할 리스트
    saved_articles = []

    for article in source.articles[:3]:  # 첫 3개의 기사만 크롤링
        article.download()
        article.parse()

        # 중복 저장 방지 (URL로 확인)
        if not News.objects.filter(url=article.url).exists():
            # News 모델에 데이터 저장
            saved_article = News.objects.create(
                title=article.title or "제목 없음",
                content=article.text or "내용 없음",
                url=article.url,
                publish_date=article.publish_date or datetime.now()
            )
            saved_articles.append(saved_article)

    # 저장된 데이터를 JSON 응답으로 반환
    return Response({"message": f"{len(saved_articles)}개의 기사가 저장되었습니다."})


@api_view(['GET'])
def get_articles(request):
    """
    DB에서 저장된 뉴스 데이터를 반환
    """
    articles = News.objects.all()

    # Serializer로 변환
    serializer = NewsSerializer(articles, many=True)
    print(serializer.data)
    return Response(serializer.data)
