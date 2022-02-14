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
    const newInter = { pattern: 'example.com', enabled: true }
    const inter = addIntercept(newInter)
    expect(intercepts).toBeArrayOfSize(1)
    expect(intercepts).toContainEqual(inter)
    expect(inter.id).toBeDefined()
    expect(inter).toMatchObject(newInter)
  })

  it('should have 10 intercepts after addIntercept', () => {
    for (let i = 0; i < 10; i++) {
      addIntercept({ pattern: `intercept-${i}`, enabled: true })
    }
    expect(intercepts).toBeArrayOfSize(10)
  })

  it('should getIntercept', () => {
    const newInter = addIntercept({ pattern: 'example.com', enabled: true })

    const inter = getIntercept(newInter.id as string)
    expect(inter).toEqual(newInter)
  })

  it('should not getIntercept with invalid id', () => {
    const inter = getIntercept('toto')
    expect(inter).toBeUndefined()
  })

  it('should updateIntercept', () => {
    const newInter = addIntercept({ pattern: 'example.com', enabled: true })
    const id = newInter.id as string
    let updatedInter = updateIntercept(id as string, {
      pattern: 'eixample.com',
    })
    expect(updateIntercept).toBeDefined()
    expect(updatedInter?.id).toBe(id)
    expect(updatedInter?.pattern).toBe('eixample.com')
    expect(updatedInter?.enabled).toBe(true)

    updatedInter = updateIntercept(id as string, {
      enabled: false,
    })
    expect(updateIntercept).toBeDefined()
    expect(updatedInter?.id).toBe(id)
    expect(updatedInter?.pattern).toBe('eixample.com')
    expect(updatedInter?.enabled).toBe(false)
  })

  it('should not updateIntercept with invalid id', () => {
    const updatedInter = updateIntercept('toto', {
      pattern: 'eixample.com',
    })
    expect(updatedInter).toBeUndefined()
  })

  it('should have 0 intercepts after removeIntercept', () => {
    const inter = addIntercept({ pattern: 'example.com', enabled: true })
    removeIntercept(inter.id as string)
    expect(intercepts).toBeArrayOfSize(0)
  })
})
