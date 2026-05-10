# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 7860
ENV ASPNETCORE_URLS=http://+:7860

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["YaungMel_POS.WebApi/YaungMel_POS.WebApi.csproj", "YaungMel_POS.WebApi/"]
COPY ["YaungMel_POS.Database/YaungMel_POS.Database.csproj", "YaungMel_POS.Database/"]
COPY ["YaungMel_POS.Domain/YaungMel_POS.Domain.csproj", "YaungMel_POS.Domain/"]
COPY ["YaungMel_POS.Shared/YaungMel_POS.Shared.csproj", "YaungMel_POS.Shared/"]
RUN dotnet restore "./YaungMel_POS.WebApi/YaungMel_POS.WebApi.csproj"
COPY . .
WORKDIR "/src/YaungMel_POS.WebApi"
RUN dotnet build "./YaungMel_POS.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./YaungMel_POS.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
USER root
RUN apt-get update && apt-get install -y \
    fontconfig \
    libfreetype6 \
    libjpeg62-turbo \
    libpng16-16 \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base \
    wget \
    && wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.bookworm_amd64.deb \
    && dpkg -i wkhtmltox_0.12.6.1-3.bookworm_amd64.deb \
    && apt-get install -f -y \
    && rm wkhtmltox_0.12.6.1-3.bookworm_amd64.deb
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "YaungMel_POS.WebApi.dll"]
