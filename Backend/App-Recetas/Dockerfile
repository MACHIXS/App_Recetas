# Stage 1: build
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos only the pom for caching
COPY Backend/App-Recetas/pom.xml ./pom.xml
RUN mvn dependency:go-offline

# Copiamos el código
COPY Backend/App-Recetas/src ./src
RUN mvn package -DskipTests

# Stage 2: runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app-recetas.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app-recetas.jar"]
