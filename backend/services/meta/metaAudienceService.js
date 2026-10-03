export class MetaAudienceService {
  async fetchAudienceDemographics({ pageId, accessToken }) {
    return {
      source: 'meta_adapter',
      status: 'ready',
      demographics: {}
    };
  }
}

export const metaAudienceService = new MetaAudienceService();
