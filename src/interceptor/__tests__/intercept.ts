import {
  addIntercept,
  getIntercept,
  intercepts,
  removeIntercept,
  updateIntercept,
} from '../intercept'

describe('[intercept.intercept]', () => {
  afterEach(() => {
    // Empty intercepts array
    intercepts.splice(0, intercepts.length)
  })

  it('should not have intercepts at start', () => {
    expect(intercepts).toBeArrayOfSize(0)
  })

  it('should have 1 intercept after addIntercept', () => {
    const inter = addIntercept(globalMocks.intercept)
    expect(intercepts).toBeArrayOfSize(1)
    expect(intercepts).toContainEqual(inter)
    expect(inter.id).toBeDefined()
    expect(inter).toMatchObject({
      ...globalMocks.intercept,
      id: expect.any(String),
    })
  })

  it('should have 10 intercepts after addIntercept', () => {
    for (let i = 0; i < 10; i++) {
      addIntercept({ ...globalMocks.intercept, pattern: `intercept-${i}` })
    }
    expect(intercepts).toBeArrayOfSize(10)
  })

  it('should getIntercept', () => {
    const newInter = addIntercept(globalMocks.intercept)

    const inter = getIntercept(newInter.id as string)
    expect(inter).toEqual(newInter)
  })

  it('should not getIntercept with invalid id', () => {
    const inter = getIntercept('toto')
    expect(inter).toBeUndefined()
  })

  it('should updateIntercept', () => {
    const newInter = addIntercept(globalMocks.intercept)
    const id = newInter.id as string
    let updatedInter = updateIntercept(id as string, {
      pattern: 'eixample.com',
    })
    expect(updatedInter).toBeDefined()
    expect(updatedInter).toMatchObject({
      id,
      pattern: 'eixample.com',
      enabled: true,
      interceptResponse: false,
    })

    updatedInter = updateIntercept(id as string, {
      enabled: false,
    })
    expect(updatedInter).toBeDefined()
    expect(updatedInter).toMatchObject({
      id,
      pattern: 'eixample.com',
      enabled: false,
      interceptResponse: false,
    })

    updatedInter = updateIntercept(id as string, {
      interceptResponse: true,
    })
    expect(updatedInter).toBeDefined()
    expect(updatedInter).toMatchObject({
      id,
      pattern: 'eixample.com',
      enabled: false,
      interceptResponse: true,
    })
  })

  it('should not updateIntercept with invalid id', () => {
    const updatedInter = updateIntercept('toto', {
      pattern: 'eixample.com',
    })
    expect(updatedInter).toBeUndefined()
  })

  it('should have 0 intercepts after removeIntercept', () => {
    const inter = addIntercept(globalMocks.intercept)
    removeIntercept(inter.id as string)
    expect(intercepts).toBeArrayOfSize(0)
  })
})
