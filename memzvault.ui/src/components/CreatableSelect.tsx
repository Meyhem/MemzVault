import RCCreatableSelect, { Props } from 'react-select/creatable'
import { FC } from 'react'
import styled from 'styled-components'

const StyledSelect = styled(RCCreatableSelect)`
  .react-select__control {
    background: ${({ theme }) => theme.colors.bg1};
    border: none;
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
    background-color: ${({ theme }) => theme.colors.border2};
  }
`

export const CreatableSelect: FC<Props<any, true>> = (props) => {
  // const styles = useMemo(
  //   () =>
  //     ({
  //       option: (old) => ({
  //         ...old,
  //         backgroundColor: theme.colors.bg2,
  //       }),
  //       control: (old) => ({
  //         ...old,
  //         backgroundColor: theme.colors.bg2,
  //         text: theme.colors.text1,
  //       }),
  //       menuList: (old) => ({
  //         ...old,
  //         paddingTop: 0,
  //         paddingBottom: 0,
  //       }),
  //     } as StylesConfig<any, true>),
  //   [theme]
  // )

  return (
    <StyledSelect
      classNamePrefix="react-select"
      isMulti={true}
      {...props}
      {...({} as any)}
    />
  )
}
