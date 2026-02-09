// ===========================================
// VS Design Diverge: Philosophy Page
// OKLCH Color System + Editorial Minimalism
// Flowing prose narrative with embedded images
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Image from 'next/image'

const Philosophy: NextPage = () => {
  return (
    <Layout>
      <PageHeader
        title="목회 철학"
        subtitle="골로새서 1:28을 기초로 예수 그리스도의 사역을 본받는 교회"
        label="Ministry Philosophy"
        height="h-72 md:h-80"
      />

      {/* Single continuous article section */}
      <article style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">

          {/* Opening accent line */}
          <div className="h-0.5 w-12 mb-8" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />

          <span
            className="text-xs font-medium tracking-[0.2em] uppercase mb-6 block"
            style={{ color: 'oklch(0.72 0.10 75)' }}
          >
            교회의 사명 &middot; Colossians 1:23&ndash;28
          </span>

          {/* Key Verse */}
          <div
            className="rounded-sm p-8 md:p-10 mb-10"
            style={{
              background: 'linear-gradient(135deg, oklch(0.30 0.09 265 / 0.05), oklch(0.72 0.10 75 / 0.08))',
              border: '1px solid oklch(0.72 0.10 75 / 0.3)',
            }}
          >
            <p
              className="text-sm leading-loose font-korean mb-6"
              style={{ color: 'oklch(0.45 0.03 75)' }}
            >
              만일 너희가 믿음에 거하고 터 위에 굳게 서서 너희 들은 바 복음의 소망에서 흔들리지 아니하면 그리하리라.
              이 복음은 천하 만민에게 전파된 바요 나 바울은 이 복음의 일꾼이 되었노라.
              나는 이제 너희를 위하여 받는 괴로움을 기뻐하고
              그리스도의 남은 고난을 그의 몸된 교회를 위하여 내 육체에 채우노라.
              내가 교회의 일꾼 된 것은 하나님이 너희를 위하여 내게 주신 직분을 따라
              하나님의 말씀을 이루려 함이니라.
            </p>
            <p
              className="text-lg md:text-xl font-semibold leading-relaxed font-korean"
              style={{ color: 'oklch(0.30 0.09 265)' }}
            >
              &ldquo;우리가 그를 전파하여 각 사람을 권하고 모든 지혜로 각 사람을 가르침은
              각 사람을 그리스도 안에서 완전한 자로 세우려 함이니&rdquo;
            </p>
            <p
              className="text-sm mt-3 font-korean"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              &mdash; 골로새서 1:28
            </p>
          </div>

          {/* Flowing prose begins */}
          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            골로새서 1:28절이 우리 교회의 사역이며 성도들이 행해야 하고, 특별히 교회의
            제직들이 가져야 하는 사역의 모습과 목적입니다. 이 말씀 속에는 교회가 존재하는
            이유와 우리가 행해야 할 사역의 본질이 담겨 있습니다.
          </p>

          <h2
            className="font-headline font-bold mb-6 mt-14"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
          >
            예수님의 3중 사역
          </h2>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            예수님이 그리스도 되심과 그의 십자가의 복음 전파가 교회의 존재 목적입니다.
            각 사람을 권면하고 그들의 삶의 어려움에서 건져 내는 것이 교회가 지닌 사명입니다.
            모든 지혜로 각 사람을 가르침은 교회가 행해야 하는 복음 사역이며 진리를 이 땅에
            전하는 하나님의 명령이십니다.
          </p>

          {/* Threefold Ministry Image — embedded in flow */}
          <figure className="my-10 -mx-4 sm:mx-0">
            <div className="rounded-sm overflow-hidden" style={{ boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.10)' }}>
              <Image
                src="/images/philosophy/threefold-ministry.jpeg"
                alt="예수님의 3중 사역 - 전파, 가르침, 세움"
                width={1200}
                height={500}
                className="w-full h-auto"
              />
            </div>
            <figcaption className="text-xs mt-3 font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>
              골로새서 1:28 &mdash; 우리가 그를 전파하여, 각 사람을 권하고, 모든 지혜로 각 사람을 가르침은,
              각 사람을 그리스도 안에서 완전한 자로 세우려 함이니
            </figcaption>
          </figure>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            예수님이 행하셨던 일과 같은 일을 우리가 하는 것입니다. 마태복음 4:23에는
            &ldquo;...회당에서 가르치시며, 천국 복음을 전파하시며, 백성 중의 모든 병과 모든 약한 것을
            고치시니&rdquo;라고 예수님이 행하신 사역을 3가지로 말씀하십니다. 하나님 나라를
            증거하시고 전하면서 하나님 나라를 확장하는 일이 주님의 주 사역이었습니다. 그리고
            하나님 나라의 통치를 알리시기 위해서 사람들을 가르치시고, 백성들의 아픔과
            고통들을 낫게 하신 것입니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            교회가 가진 사명도 같습니다. 하나님 나라가 그들 가운데 임하게 하는 것입니다.
            하나님의 통치가 그들 가운데 실제적으로 작용하도록 가르치는 것입니다. 그리고 그
            중요한 임무에 교회가 부름 받은 것입니다. 복음을 전파하고 각 사람에게 복음의 진리에
            따라 살아가도록 권면하고 각 사람들을 그리스도의 가치관으로 살아가도록 가르치는
            것입니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            그리고 우리의 목표는 그리스도 안에서 완전한 삶, 거룩한 삶을 살아가도록,
            하나의 아름다운 교회가 되도록, 한 인격자, 한 자유자, 한 생명을 낳는 자, 한 제자를
            세우는 제자로서, 그리고 또 하나의 작은 예수로 살아가는 자를 세우는 것입니다.
            교회는 이 일이 끊임없이 이어지는 장소일 뿐입니다. 생명에서 생명을 낳고, 하나님의
            통치가 계속 이어져가고, 하나님의 지혜와 진리로 사는 자를 세워가는 것입니다.
          </p>

          <p className="text-base leading-loose font-korean mb-10" style={{ color: 'oklch(0.35 0.03 75)' }}>
            성도는 이 일을 위해서 필요한 것들이 무엇인가를 고민하는 것입니다.
          </p>

          {/* Pastoral Philosophy Declaration */}
          <div
            className="rounded-sm p-8 md:p-10 mb-10"
            style={{
              background: 'linear-gradient(135deg, oklch(0.30 0.09 265 / 0.05), oklch(0.72 0.10 75 / 0.08))',
              border: '1px solid oklch(0.72 0.10 75 / 0.3)',
            }}
          >
            <h3 className="text-lg font-bold mb-4 font-korean" style={{ color: 'oklch(0.30 0.09 265)' }}>
              목회 철학
            </h3>
            <p
              className="text-lg font-semibold leading-relaxed font-korean mb-4"
              style={{ color: 'oklch(0.30 0.09 265)' }}
            >
              &ldquo;복음의 진리 가운데 모든 이들이 하나님의 생명 가운데 자유함을 누리게 하는 것이다.&rdquo;
            </p>
            <p className="text-xs mb-4 font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>
              (요한복음 8장과 10장 &ldquo;진리가 너희를 자유케 하리라&rdquo;, &ldquo;풍성함을 누리는 삶&rdquo;)
            </p>
            <div className="space-y-2">
              <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.45 0.12 265)' }}>
                우리는 세상의 진리가 아닌 하나님의 진리를 선포하는 것이다
              </p>
              <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.45 0.12 265)' }}>
                우리는 이 땅의 생명으로 하나님의 영원한 생명을 경험하는 것이다
              </p>
              <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.45 0.12 265)' }}>
                우리는 하나님의 생명 가운데 참 자유함을 누리는 것이다
              </p>
            </div>
          </div>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            이 일을 위해서 목회자로서 할 일은 오직 성령의 능력을 의지하여 겸손함과 온유함으로
            성도들에게 하나님의 진리의 말씀을 가르치고, 선포하는 것입니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            그것은 우리가 하나님의 일을 하기 전에, 먼저 하나님께서 우리를 위해 하신 일들, 즉
            하나님이 창세전에 계획하셨던 일, 예수 그리스도께서 우리를 위해서 십자가에서 이루신
            일들과 그 분의 삶과 인격, 그리고 성령께서 우리 안에서 역사하시는 일들을 먼저
            성도들에게 가르치는 것이 목회의 내용입니다 (에베소서 1:3-14).
          </p>

          {/* Transition to concrete ministry form */}
          <h2
            className="font-headline font-bold mb-6 mt-14"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
          >
            구체적인 목회 형태
          </h2>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            저의 목회 형태는 사도행전의 원시 기독교 공동체의 삶 형태 속에 있었던 예배, 교제, 교육,
            복음 선포, 섬김을 적용하는 것입니다 (사도행전 2:42-47; 마리아 해리스(Maria Harris)의
            교육 목회를 적용). 이것은 사역의 기능이 아니라 원래부터 있었던 하나님을 섬기는
            사람들의 존재 양식이요 하나님을 아버지로 모시고 모였던 백성들의 신앙 경험의
            표현양식이었습니다.
          </p>

          {/* Ministry Form Image — embedded in flow */}
          <figure className="my-10 flex flex-col items-center">
            <div
              className="rounded-sm overflow-hidden"
              style={{
                boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.10)',
                background: 'oklch(0.99 0.002 75)',
              }}
            >
              <Image
                src="/images/philosophy/ministry-form.png"
                alt="구체적인 목회 형태 - 사도행전 2:42-47을 모델로 하는 교회"
                width={700}
                height={700}
                className="w-full max-w-[550px] h-auto p-4"
              />
            </div>
            <figcaption className="text-xs mt-3 font-korean text-center" style={{ color: 'oklch(0.55 0.01 75)' }}>
              사도행전 2:42-47을 모델로 하는 교회 &mdash; Revival, Worship, Fellowship, Transformation, Social Action
            </figcaption>
          </figure>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            이들은 오순절의 성령 강림을 통하여서 깨닫게 된 예수 그리스도의 십자가와 부활의
            진리를 복음으로 선포하였고(Kerygma), 사도들로부터 가르침을 받았고 (Didache), 함께
            모여 교제하였고 (Koinonia), 함께 기도하고 떡을 떼며 하나님을 찬미하였으며 (Leiturgia),
            있는 자가 자기 재산을 팔아 가난한 자에게 나눠주는 (Diakonia) 삶을 살았습니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            마리아 해리스는 원시 기독교 공동체의 삶 속에서 보여주는 이러한 삶의 형태를 교회
            교육을 위한 커리큘럼의 원형으로 삼아 교육 목회 관점에서 구조화해서 다음 다섯 가지
            영역의 교육 과정 이론을 발전시켰습니다:
            예전(Leiturgia)에 관련된 기도의 커리큘럼,
            공동체가 지닌 공유성에 기초한 코이노니아(Koinonia) 커리큘럼,
            가르침의 사역과 관련된 디다케(Didache)의 커리큘럼,
            복음 선포와 관련된 케리그마(Kerygma) 커리큘럼,
            그리고 섬김과 봉사활동과 관련된 디아코니아(Diakonia) 커리큘럼입니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            이런 교육 목회 관점의 커리큘럼을 따라서 예배를 통해 하나님의 가치를 하나님의 가치로
            올려 드리고, 설교와 예전을 통해서 성도들의 신앙 성장을 위해서 노력하며, 하나님 나라
            건설과 그 백성들을 확장하는데 필요한 성도들 간의 교제와 섬김, 그리고 봉사 사역을
            실제적으로 실행되도록 돕고, 우리 이웃의 복음화와 이 땅에 하나님 나라의 확장을 위해서
            교육과 복음의 선포 사역을 강화할 것입니다.
          </p>

          {/* Confessions as flowing text with subtle styling */}
          <p className="text-base leading-loose font-korean mb-4" style={{ color: 'oklch(0.35 0.03 75)' }}>
            결과적으로 위의 내용을 기반으로 고백적 선언과 실천항목을 세워 본다면 다음과 같습니다:
          </p>

          <div
            className="rounded-sm p-6 md:p-8 mb-10"
            style={{
              borderLeft: '4px solid oklch(0.45 0.12 265)',
              background: 'oklch(0.97 0.005 75)',
            }}
          >
            <div className="space-y-3 font-korean">
              <p className="text-base leading-relaxed" style={{ color: 'oklch(0.25 0.05 265)' }}>
                <strong>우리가 하나님을 예배한다(Leiturgia)</strong>
                <span style={{ color: 'oklch(0.55 0.01 75)' }}> &mdash; 예배와 예전 그리고 기도 (롬 12:1-2)</span>
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'oklch(0.25 0.05 265)' }}>
                <strong>우리는 성령 안에서 더불어 살아간다(Koinonia)</strong>
                <span style={{ color: 'oklch(0.55 0.01 75)' }}> &mdash; 친교와 교제 (엡 4:13-16)</span>
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'oklch(0.25 0.05 265)' }}>
                <strong>우리는 하나님의 백성으로 성숙한다(Didache)</strong>
                <span style={{ color: 'oklch(0.55 0.01 75)' }}> &mdash; 가르침과 훈련 (골 3:16-17)</span>
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'oklch(0.25 0.05 265)' }}>
                <strong>우리는 하나님나라를 선포한다(Kerygma)</strong>
                <span style={{ color: 'oklch(0.55 0.01 75)' }}> &mdash; 말씀의 선포와 전도 (사 60:22)</span>
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'oklch(0.25 0.05 265)' }}>
                <strong>우리는 예수님의 섬김으로 이웃을 사랑한다(Diakonia)</strong>
                <span style={{ color: 'oklch(0.55 0.01 75)' }}> &mdash; 봉사와 섬김 (약 1:26-27)</span>
              </p>
            </div>
          </div>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            하나님의 말씀에 기반하여 성령님의 도우심과 성도들과 협력하여 교회를 목회적으로
            운영할 때 제가 그리고 있는 실제적인 교회 미니스트리 맵은 아래와 같습니다.
          </p>

          {/* Ministry Map Image — embedded in flow */}
          <figure className="my-10 flex flex-col items-center">
            <div
              className="rounded-sm overflow-hidden"
              style={{
                boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.10)',
                background: 'oklch(0.99 0.002 75)',
              }}
            >
              <Image
                src="/images/philosophy/ministry-map.png"
                alt="Church Ministry Map - 양육, 훈련, 사역의 체계"
                width={700}
                height={800}
                className="w-full max-w-[550px] h-auto p-4"
              />
            </div>
            <figcaption className="text-xs mt-3 font-korean text-center" style={{ color: 'oklch(0.55 0.01 75)' }}>
              Church Ministry Map &mdash; Individual(양육) &rarr; Relationship(훈련) &rarr; Activity(사역)
            </figcaption>
          </figure>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            개인의 신앙 기초를 세우는 양육의 단계에서는 경건의 시간(QT)과 개인 기도, 새가족반을 통해
            하나님과의 관계를 형성하고 평신도 사역자로서의 의식을 갖추게 됩니다. 공동체 안에서
            관계를 통해 성장하는 훈련의 단계에서는 예배와 설교, 사랑방, 중보기도모임, 그리고
            초급반에서 제자훈련, 사역훈련, 리더훈련에 이르는 과정을 통해 그리스도인으로
            훈련됩니다. 마지막으로 훈련받은 성도가 은사에 따라 섬기는 사역의 단계에서는
            각종 은사별 사역팀과 교회 내 사역, 대외 사역, 전도와 선교를 통해
            하나님 나라를 확장해 나갑니다.
          </p>

          {/* Transition to calling and discipleship */}
          <h2
            className="font-headline font-bold mb-6 mt-14"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
          >
            교회의 존재 이유와 우리의 사역
          </h2>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            모든 성숙한 성도는 두 가지 의미의 사역자가 되어야 합니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            첫째, 복음의 일꾼이 되어야 합니다 (골 1:23). 복음의 확신이 필요합니다. 삼위
            하나님의 사역에 대하여 분명히 알고 증거할 수 있어야 합니다. 이 진리에 대해서
            분명히 알고 살아가야 흔들리지 않고 다른 사람들에게도 복음을 바르게 증거할
            수 있습니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            둘째, 교회의 일꾼이 되어야 합니다 (골 1:25). 지역 교회가 왜 존재해야 하는지에 대한
            확실한 근거가 중요합니다.
          </p>

          {/* Key Question */}
          <div
            className="rounded-sm p-8 md:p-10 mb-10"
            style={{
              background: 'oklch(0.25 0.08 265)',
              boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.15)',
            }}
          >
            <p
              className="text-xs font-medium tracking-[0.15em] uppercase mb-4"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              마태복음 28:19-20
            </p>
            <p
              className="text-lg md:text-xl font-bold leading-relaxed font-korean"
              style={{ color: 'oklch(0.98 0.003 75)' }}
            >
              그렇다면 우리 교회의 존재 이유와
              우리 (제직, 성도로서의 직분자들)의 사역은 어떠해야 하는가?
            </p>
          </div>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            제자론의 기본은 하나님 앞에서 인간의 존재론을 정립하는 것입니다. 하나님이
            누구신가에 대한 바른 신관의 정립과 함께 자신의 정체성을 정립하는 것에서
            시작됩니다. 존재론을 정립한 사람은 개인의 성품을 변화시켜 나갑니다. 하나님과의
            관계 속에서 그리스도의 성품을 닮아가며 날로 변화되는 삶을 살아갑니다.
          </p>

          <p className="text-base leading-loose font-korean mb-6" style={{ color: 'oklch(0.35 0.03 75)' }}>
            참된 인격을 만들어가는 자들은 공동체를 위해 참된 해석자가 되어갑니다. 성숙한
            그리스도인은 공동체 안에서 하나님의 말씀을 올바르게 해석하고 적용하는 역할을
            감당합니다. 해석하는 공동체인 교회는 예언적 공동체며 은혜의 공동체입니다. 교회는
            세상 속에서 하나님의 뜻을 선포하고 은혜를 나누는 예언적 역할을 수행합니다.
          </p>

          <p className="text-base leading-loose font-korean mb-10" style={{ color: 'oklch(0.35 0.03 75)' }}>
            기독교 공동체는 완성된 종말을 이곳에서 살아가는 시간론에 기초합니다. 이미
            이루어진 하나님 나라의 완성을 믿으며, 지금 이곳에서 그 나라의 가치를 실현해
            갑니다.
          </p>

          {/* Closing summary */}
          <div
            className="rounded-sm p-6 md:p-8 mb-6"
            style={{
              borderLeft: '4px solid oklch(0.72 0.10 75)',
              background: 'oklch(0.97 0.005 75)',
            }}
          >
            <div className="space-y-3 font-korean">
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.35 0.03 75)' }}>
                <strong style={{ color: 'oklch(0.25 0.05 265)' }}>1.</strong> 제자론의 기본은 하나님 앞에서 인간의 존재론을 정립하는 것이다
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.35 0.03 75)' }}>
                <strong style={{ color: 'oklch(0.25 0.05 265)' }}>2.</strong> 존재론을 정립한 사람은 개인의 성품을 변화시켜 나간다
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.35 0.03 75)' }}>
                <strong style={{ color: 'oklch(0.25 0.05 265)' }}>3.</strong> 참된 인격을 만들어가는 자들은 공동체를 위해 참된 해석자가 되어간다
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.35 0.03 75)' }}>
                <strong style={{ color: 'oklch(0.25 0.05 265)' }}>4.</strong> 해석하는 공동체인 교회는 예언적 공동체며 은혜의 공동체다
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.35 0.03 75)' }}>
                <strong style={{ color: 'oklch(0.25 0.05 265)' }}>5.</strong> 기독교 공동체는 완성된 종말을 이곳에서 살아가는 시간론에 기초한다
              </p>
            </div>
          </div>

          {/* Final accent line */}
          <div className="h-0.5 w-12 mt-16" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />

        </div>
      </article>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default Philosophy
