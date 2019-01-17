import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProps, NOConfigProps } from 'src/interfaces';
import { NavigationStackScreenOptions } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import { FooStore } from '../store';
import { PullRenderItem } from 'components/PullRefresh/interface';
import PullFlatList from 'components/PullRefresh/PullFlatList';

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
class Nested extends React.Component {
  static navigationOptions = ({ navigation }: NOConfigProps): NavigationStackScreenOptions => ({
    title: '标题'
  });

  state: State = {

  }

  get injected() {
    return this.props as InjectedProps;
  }

  navigationParams: NavigationParams = {

  }

  render() {
    return (
      <View />
    );
  }
}

const style = StyleSheet.create({

});

export default Nested;
