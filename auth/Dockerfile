FROM eclipse-temurin:17-jdk-jammy

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src src

# Note: Tests are run separately in CI/CD pipeline before Docker build
# This keeps Docker build fast while ensuring code quality through CI/CD testing
RUN ./mvnw clean package -DskipTests -B

RUN cp target/*.jar app.jar

EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8081/api/v1/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]