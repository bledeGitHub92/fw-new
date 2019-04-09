import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProps } from 'src/interfaces';
import { inject, observer } from 'mobx-react/native';
import { FooStore } from '../store';
import { PullRenderItem } from 'components/PullRefresh/interface';
import PullFlatList from 'components/PullRefresh/PullFlatList';
import { Provider } from 'components/elements@2.0';

interface InjectedProps extends NavigationProps {
  FooStore: FooStore,
}

interface State {

}

/**
 * 页面参数
 */
export interface NavigationParams {

}

@inject('FooStore')
@observer
class Nested extends React.Component<any, State> {
  navigationParams: NavigationParams = {

  }
  
  state = {

  }

  get injected() {
    return this.props as InjectedProps;
  }

  render() {
    return (
      <Provider headerTitle="">
        <View style={style.wrapper}>

        </View>
      </Provider>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  }
});

export default Nested;
