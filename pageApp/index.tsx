import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationProps, NOConfigProps } from 'src/interfaces';
import { NavigationStackScreenOptions, NavigationEvents } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import { FooStore } from './store';
import { PullRenderItem } from 'components/PullRefresh/interface';
import PullFlatList from 'components/PullRefresh/PullFlatList';
import { Params } from 'src/interfaces/page';

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

  renderRow = (data: PullRenderItem<>) => {
    const item = data.item;
    return (
      
    );
  }
  
  refreshPage = ({ current = 1, pageSize = 10 }: Params = { current: 1, pageSize: 10 }) => {
    return this.injected.FooStore
  }


  render() {
    const { FooStore: store } = this.injected;
    return (
      <View style={{ flex: 1, backgroudColor: '#f4f6fa' }}>
        <NavigationEvents onDidFocus={this.refreshPage} />
        <PullFlatList
          onceMount={false}
          data={store.}
          rednerItem={this.renderRow}
          zonPullRelease={this.refreshPage}
        />
      </View>
    );
  }
}


const style = StyleSheet.create({

});

export default Foo;
