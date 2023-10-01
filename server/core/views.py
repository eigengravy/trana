from django.shortcuts import render
from django.conf import settings
from .models import Files
from rest_framework import viewsets
from rest_framework.decorators import action
from .serializers import FilesSerializer
from django.http import JsonResponse
import csv
import json
import requests
import redis
import httpx


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer

    @action(detail=False, methods=["post"])
    def formatter(self, request):
        try:
            id_value = int(request.data.get("id"))
            uploaded_file = Files.objects.get(id=id_value)

            csv_path = uploaded_file.csv.path

            with open(csv_path, "r") as csvfile:
                csvreader = csv.reader(csvfile)
                header = next(csvreader)
                sample_rows = [next(csvreader) for _ in range(3)]

            header_text = "Header columns: " + ", ".join(header)
            sample_rows_text = "\n".join(
                [
                    f"Sample Row {i + 1}: " + ", ".join(row)
                    for i, row in enumerate(sample_rows)
                ]
            )

            formatted_text = f"{header_text}\n\n{sample_rows_text}"

            return JsonResponse({"formatted_text": formatted_text})

        except Files.DoesNotExist:
            return JsonResponse({"error": "File not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


class ScrapperViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["post"])
    def queries(self, request):
        r = redis.Redis(host="localhost", port=6379, decode_responses=True)
        data = json.loads(request.body.decode("utf-8"))
        site_url = data.get("url")
        r.set(site_url, "false")
        httpx.post("http://localhost:6969/infer", data={"url": site_url, "query": ""})

        print(site_url)

        return JsonResponse({"received": True})

    @action(detail=False, methods=["post"])
    def completed(self, request):
        r = redis.Redis(host="localhost", port=6379, decode_responses=True)
        data = json.loads(request.body.decode("utf-8"))
        site_url = data.get("url")
        r.set(site_url, "true")
        print(site_url)

    @action(detail=False, methods=["post"])
    def getSite(self, request):
        r = redis.Redis(host="localhost", port=6379, decode_responses=True)
        data = json.loads(request.body.decode("utf-8"))
        site_url = data.get("url")
        completed = r.get(site_url)
        print(site_url, completed)

        return JsonResponse({"site_url": site_url, "completed": completed})


class ChatViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["post"])
    def queries(self, request):
        r = redis.Redis(host="localhost", port=6379, decode_responses=True)
        data = json.loads(request.body.decode("utf-8"))
        query = data.get("query")
        site_url = data.get("url")
        r.set(query, "false")

        httpx.post(
            "http://localhost:6969/infer", data={"url": site_url, "query": query}
        )

        return JsonResponse({"received": True})

    @action(detail=False, methods=["post"])
    def answer(self, request):
        r = redis.Redis(host="localhost", port=6379, decode_responses=True)
        data = json.loads(request.body.decode("utf-8"))
        query = data.get("query")
        site_url = data.get("url")
        answer = data.get("answer")
        r.set(query, answer)

    @action(detail=False, methods=["post"])
    def getAnswer(self, request):
        r = redis.Redis(host="localhost", port=6379, decode_responses=True)
        data = json.loads(request.body.decode("utf-8"))
        query = data.get("query")
        answer = r.get(query)
        print(query, answer)

        return JsonResponse({"query": query, "answer": answer})
