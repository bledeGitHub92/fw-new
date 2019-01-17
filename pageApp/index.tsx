import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationProps, NOConfigProps } from 'src/interfaces';
import { NavigationStackScreenOptions } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import { FooStore } from './store';
import { PullRenderItem } from 'components/PullRefresh/interface';
import PullFlatList from 'components/PullRefresh/PullFlatList';

interface InjectedProps extends NavigationProps {
  FooStore: FooStore,
}

interface State {

}

@inject('FooStore')
@observer
class Foo extends React.Component {
  static navigationOptions = ({ navigation }: NOConfigProps): NavigationStackScreenOptions => ({
    title: '标题'
  });

  get injected() {
    return this.props as InjectedProps;
  }

  state: State = {

  }

  render() {
    return (
      <View />
    );
  }
}


const style = StyleSheet.create({

});

export default Foo;
