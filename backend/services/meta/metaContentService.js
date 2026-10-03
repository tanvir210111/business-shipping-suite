export class MetaContentService {
  async fetchPublishedPosts({ pageId, accessToken }) {
    return {
      source: 'meta_adapter',
      status: 'ready',
      posts: []
    };
  }
}

export const metaContentService = new MetaContentService();
