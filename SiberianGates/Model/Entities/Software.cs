﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SiberianGates.Model.Entities
{
    class Software : EntityBase
    {
      public SoftwareType Type { get; set; }
    }

    class SoftwareType : EntityBase
    {

    }
}