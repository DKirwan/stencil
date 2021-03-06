import * as d from '../../declarations';
import { normalizeHref } from './prerender-config';
import { URL } from 'url';


export function initializePrerenderEntryUrls(manager: d.PrerenderManager) {
  const base = new URL(manager.origin);
  manager.origin = base.origin;
  manager.config.logger.debug(`prerender http origin: ${manager.origin}`);

  if (Array.isArray(manager.prerenderConfig.entryUrls)) {
    manager.prerenderConfig.entryUrls.forEach(entryUrl => {
      const url = manager.prerenderConfig.normalizeUrl(entryUrl, base);
      const href = normalizeHref(manager.prerenderConfig, manager.diagnostics, url);
      addUrlToPendingQueue(manager, href, '#entryUrls');
    });

  } else {
    const url = manager.prerenderConfig.normalizeUrl(manager.outputTarget.baseUrl, base);
    const href = normalizeHref(manager.prerenderConfig, manager.diagnostics, url);
    addUrlToPendingQueue(manager, href, '#baseUrl');
  }
}


export function addUrlToPendingQueue(manager: d.PrerenderManager, queueUrl: string, fromUrl: string) {
  if (typeof queueUrl !== 'string' || queueUrl === '') {
    return;
  }
  if (manager.urlsPending.has(queueUrl)) {
    return;
  }
  if (manager.urlsProcessing.has(queueUrl)) {
    return;
  }
  if (manager.urlsCompleted.has(queueUrl)) {
    return;
  }

  manager.urlsPending.add(queueUrl);

  if (manager.isDebug) {
    const url = new URL(queueUrl).pathname;
    const from = fromUrl.startsWith('#') ? fromUrl : new URL(fromUrl).pathname;
    manager.config.logger.debug(`prerender queue: ${url} (from ${from})`);
  }
}
