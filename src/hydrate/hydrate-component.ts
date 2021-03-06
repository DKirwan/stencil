import * as d from '../declarations';
import { connectedCallback, getComponent, registerHost } from '@platform';
import { proxyHostElement } from './proxy-host-element';


export function hydrateComponent(win: Window, results: d.HydrateResults, tagName: string, elm: d.HostElement, waitPromises: Promise<any>[]) {
  const Cstr = getComponent(tagName);

  if (Cstr != null) {
    const cmpMeta = Cstr.cmpMeta;

    if (cmpMeta != null) {
      results.hydratedCount++;

      const hydratePromise = new Promise(async resolve => {
        try {
          registerHost(elm);
          proxyHostElement(elm, cmpMeta);
          connectedCallback(elm, cmpMeta);

          await elm.componentOnReady();

        } catch (e) {
          win.console.error(e);
        }

        resolve();
      });

      waitPromises.push(hydratePromise);
    }
  }
}
