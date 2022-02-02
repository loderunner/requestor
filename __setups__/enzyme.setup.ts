import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Enzyme from 'enzyme'

import 'jest-enzyme'

Enzyme.configure({ adapter: new Adapter() })
