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

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer

    @action(detail=False, methods=['post'])
    def formatter(self, request):
        try:
            id_value = int(request.data.get('id'))
            uploaded_file = Files.objects.get(id=id_value)

            csv_path = uploaded_file.csv.path

            with open(csv_path, 'r') as csvfile:
                csvreader = csv.reader(csvfile)
                header = next(csvreader)
                sample_rows = [next(csvreader) for _ in range(3)]

            header_text = "Header columns: " + ", ".join(header)
            sample_rows_text = "\n".join([f"Sample Row {i + 1}: " + ", ".join(row) for i, row in enumerate(sample_rows)])

            formatted_text = f"{header_text}\n\n{sample_rows_text}"

            return JsonResponse({'formatted_text': formatted_text})

        except Files.DoesNotExist:
            return JsonResponse({'error': 'File not found'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        

class ChatViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def queries(self, request): 
        data = json.loads(request.body.decode('utf-8'))
        messages=data.get('messages')

        url = settings.GPT_URL
        
        payload = json.dumps({
          "transforms": ["middle-out"],
          "model": "openai/gpt-3.5-turbo",
          "messages": messages
        })
        headers = {
          'HTTP-Referer': settings.SITE_URL,
          'X-Title': settings.SITE_NAME,
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+settings.API_KEY
        }
        
        response = json.loads(requests.request("POST", url, headers=headers, data=payload).text)
        # print(response)

        answer = response['choices'][0]['message']['content']
        # print(answer)
        
        # return JsonResponse({'messages': messages, 'response' : response})
        return JsonResponse({'response' : answer})
