import React from 'react';
import Rollbar from 'rollbar';

import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import SignalView from './components/SignalView/SignalView';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'StarterPlugin';

export default class StarterPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerLogger();
    this.registerReducers(manager);

    const options = { sortOrder: -1 };
    flex.AgentDesktopView
      .Panel1
      .Content
      .add(<CustomTaskListContainer key="demo-component" />, options);

    flex.CRMContainer.Content.replace(
      <SignalView key='signalView'
        manager={manager}
        workerClient={manager.workerClient}
        rollbarClient={this.Rollbar}
      />
    );
  }

  registerLogger() {
    this.Rollbar = new Rollbar({
      reportLevel: 'debug',
      accessToken: '751a5d217402480cadc0b963e6bf1d83', // Clientside rollbar token, not sensitive, aggressively ratelimited
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        environment: 'production'
      }
    });

    const myLogManager = new window.Twilio.Flex.Log.LogManager({
      spies: [{
        type: window.Twilio.Flex.Log.PredefinedSpies.ClassProxy,
        target: window.console,
        targetAlias: 'Proxied window.console',
        methods: ['log', 'debug', 'info', 'warn', 'error'],
        onStart: (proxy) => {
          window.console = proxy;
        }
      }],
      storage: () => null,
      formatter: () => (entries) => entries[0],
      transport: () => ({
        flush: (entry) => {
          const collectedData = entry && entry.subject && entry.args;
          if (!collectedData) {
            return;
          }

          const args = entry.args.join();
          const isRollbarMethod = typeof this.Rollbar[entry.subject] === 'function';

          if (isRollbarMethod) {
            this.Rollbar[entry.subject](args);
          } else {
            this.Rollbar.log(args);
          }
        }
      })
    });

    myLogManager.prepare().then(myLogManager.start);
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
