FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip

RUN pip3 install --upgrade pip

COPY requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

RUN apt-get install -y openjdk-18-jdk sudo

COPY . /app

RUN chmod 700 /

RUN mkdir -p temp
RUN chmod 755 -R /app/temp
RUN adduser --disabled-password --gecos '' peetcode


CMD ["python3", "worker.py"]
