FROM maven:3.9.1 as builder
ENV TZ=Asia/Bangkok
WORKDIR /app
COPY .m2/ /root/.m2
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17.0.2-jdk-slim-bullseye

ARG TAG
ENV APPNAME=take-libro-api-${TAG}
COPY --from=builder /app/target/${APPNAME}.jar /${APPNAME}.jar
COPY .env /app/.env


RUN apt-get update -y
RUN apt-get install -y curl
RUN apt-get install -y apt-utils    --no-install-recommends
RUN #apt-shareget install -y libfreetype6 --no-install-recommends
RUN apt-get install -y fontconfig   --no-install-recommends
RUN apt-get install -y fonts-dejavu --no-install-recommends
HEALTHCHECK CMD curl --fail http://localhost:8080/libro/
CMD ["sh", "-c", "java -jar ${APPNAME}.jar"]
EXPOSE 8080