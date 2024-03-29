import RCCreatableSelect, { Props } from 'react-select/creatable'
import { FC } from 'react'
import styled from 'styled-components'

const StyledSelect = styled(RCCreatableSelect)`
  .react-select__control {
    background: ${({ theme }) => theme.colors.bg1};
    border: none;
  }

  .react-select__input {
    color: ${({ theme }) => theme.colors.text1};
  }

  .react-select__menu {
    margin: 0;
    .react-select__menu-list {
      padding-top: 0;
      padding-bottom: 0;

      border: 1px solid ${({ theme }) => theme.colors.border1};

      .react-select__menu-notice {
        background-color: ${({ theme }) => theme.colors.bg2};
        color: ${({ theme }) => theme.colors.text1};
      }
    }
  }
  .react-select__option {
    background-color: ${({ theme }) => theme.colors.bg2};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bg3};
    }
  }

  .react-select__multi-value {
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.bg3};

    .react-select__multi-value__label {
      color: ${({ theme }) => theme.colors.text1};
    }
  }

  .react-select__indicator-separator {
    display: none;
  }
`

export const CreatableSelect: FC<Props<any, true>> = (props) => {
  return (
    <StyledSelect
      classNamePrefix="react-select"
      isMulti={true}
      {...props}
      {...({} as any)}
    />
  )
}
