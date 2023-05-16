FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip

RUN pip3 install --upgrade pip

COPY requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

RUN apt-get install -y openjdk-18-jdk

COPY . /app

CMD ["python3", "worker.py"]
