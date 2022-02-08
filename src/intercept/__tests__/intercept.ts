import { addIntercept, intercepts, removeIntercept } from '../intercept'

describe('[intercept.intercept]', () => {
  afterEach(() => {
    intercepts.splice(0, intercepts.length)
  })

  it('should not have intercepts at start', () => {
    expect(intercepts).toBeArrayOfSize(0)
  })

  it('should have 1 intercept after addIntercept', () => {
    const inter = { pattern: 'example.com', enabled: true }
    addIntercept(inter)
    expect(intercepts).toBeArrayOfSize(1)
    expect(intercepts).toContain(inter)
  })

  it('should have 10 intercepts after addIntercept', () => {
    for (let i = 0; i < 10; i++) {
      addIntercept({ pattern: `intercept-${i}`, enabled: true })
    }
    expect(intercepts).toBeArrayOfSize(10)
  })

  it('should have 0 intercepts after removeIntercept', () => {
    const inter = { pattern: 'example.com', enabled: true }
    addIntercept(inter)
    removeIntercept(inter)
    expect(intercepts).toBeArrayOfSize(0)
  })
})
