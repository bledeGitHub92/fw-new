import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationProps } from 'src/interfaces';
import { inject, observer } from 'mobx-react/native';
import { FooStore } from './store';
import { PullRenderItem } from 'components/PullRefresh/interface';
import PullFlatList from 'components/PullRefresh/PullFlatList';
import { Provider } from 'components/elements@2.0';

interface InjectedProps extends NavigationProps {
  FooStore: FooStore,
}

interface State {

}

@inject('FooStore')
@observer
class Foo extends React.Component<any, State> {
  get injected() {
    return this.props as InjectedProps;
  }

  state = {

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

export default Foo;
