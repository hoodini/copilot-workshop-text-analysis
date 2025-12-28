// Created by AI Agent
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { TextAnalysisModule } from './text-analysis/text-analysis.module';
import { TranslationModule } from './translation/translation.module';
import { ConfigModule } from './config/config.module';
import { HttpClientModule } from './http-client/http-client.module';

@Module({
  imports: [ConfigModule, HttpClientModule, HealthModule, TextAnalysisModule, TranslationModule]
})
export class AppModule {}
